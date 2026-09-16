import os
import chromadb
from chromadb.utils import embedding_functions
from offline_engine import (
    load_roles, get_role_by_id, extract_skills, calculate_skill_match,
    analyze_ats_keywords, detect_resume_sections, calculate_resume_metrics,
    hash_text, generate_suggestions, generate_bullet_transformations
)

class VectorEngine:
    def __init__(self):
        self.chroma_client = chromadb.Client()
        self.embedding_fn = None
        self.collection = None
        
        try:
            # Initialize sentence transformer embedding function
            self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
            # Create Chroma DB collection with cosine space
            self.collection = self.chroma_client.get_or_create_collection(
                name="roles_collection",
                embedding_function=self.embedding_fn,
                metadata={"hnsw:space": "cosine"}
            )
            self._index_roles()
        except Exception as e:
            print(f"Warning: Failed to initialize VectorEngine: {e}")
            self.collection = None
            self.embedding_fn = None

    def _index_roles(self):
        if not self.collection:
            return
            
        roles = load_roles()
        if not roles:
            print("Warning: No roles found to index in VectorEngine")
            return
            
        documents = []
        metadatas = []
        ids = []
        
        for role in roles:
            role_id = role["id"]
            title = role["title"]
            category = role["category"]
            desc = role.get("description", "")
            skills_str = ", ".join(role.get("skills", []))
            keywords_str = ", ".join(role.get("keywords", []))
            
            # Text representing the role for embedding
            doc_text = f"Role: {title}\nCategory: {category}\nDescription: {desc}\nRequired Skills: {skills_str}\nKeywords: {keywords_str}"
            
            documents.append(doc_text)
            metadatas.append({"role_id": role_id, "title": title})
            ids.append(role_id)
            
        if ids:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"✓ Vector engine indexed {len(ids)} roles in ChromaDB successfully.")

    def analyze_vector(self, resume_text, target_roles):
        if not self.collection or not self.embedding_fn:
            raise RuntimeError("VectorEngine is not initialized or failed to load dependencies.")
            
        results = []
        
        for role_id in target_roles:
            role = get_role_by_id(role_id)
            if not role:
                continue
                
            # Query Chroma for the specific role to get distance
            query_res = self.collection.query(
                query_texts=[resume_text],
                n_results=1,
                where={"role_id": role_id}
            )
            
            # Default fallback similarity score (dot product / cosine)
            similarity = 0.5
            if (query_res and "distances" in query_res and query_res["distances"] and 
                    len(query_res["distances"][0]) > 0):
                distance = query_res["distances"][0][0]
                # Cosine distance = 1 - cosine_similarity
                similarity = 1.0 - distance
            
            # Scale compatibility score between 30 and 95
            compatibility_score = round(30 + 65 * max(0.0, min(1.0, similarity)))
            
            # Extract standard elements via offline helper rules
            resume_skills = extract_skills(resume_text)
            skill_match = calculate_skill_match(resume_skills, role["skills"])
            role_keywords = role["skills"] + role["keywords"]
            ats_raw = analyze_ats_keywords(resume_text, role_keywords)
            
            ats_keywords = [
                {"keyword": kw, "frequency": count}
                for kw, count in ats_raw.items() if count > 0
            ]
            
            sections = detect_resume_sections(resume_text)
            metrics = calculate_resume_metrics(resume_text, sections)
            text_hash = hash_text(resume_text)
            
            suggestions = generate_suggestions(role, skill_match, sections, metrics, text_hash)
            bullet_transformations = generate_bullet_transformations(role)
            
            results.append({
                "role": role_id,
                "compatibility_score": compatibility_score,
                "matching_skills": skill_match["matching"],
                "missing_skills": skill_match["missing"][:8],
                "ats_keywords": ats_keywords,
                "suggestions": suggestions,
                "bullet_transformations": bullet_transformations
            })
            
        return results
