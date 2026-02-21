#!/usr/bin/env python3
"""
Build FAISS index from Aptitude Book PDF.
Run this once: python build_index.py
Outputs: aptitude_data/aptitude.index and aptitude_data/chunks.npy
"""

import os
import sys
import numpy as np
from pathlib import Path

PDF_PATH = Path(__file__).parent / "Aptitude Book.pdf"
OUTPUT_DIR = Path(__file__).parent / "aptitude_data"

def chunk_text(text, size=700, overlap=150):
    chunks = []
    i = 0
    while i < len(text):
        chunks.append(text[i:i + size])
        i += size - overlap
    return chunks

def main():
    if not PDF_PATH.exists():
        print(f"ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    OUTPUT_DIR.mkdir(exist_ok=True)

    print("Loading PDF...")
    from pypdf import PdfReader
    reader = PdfReader(str(PDF_PATH))
    text = ""
    for i, page in enumerate(reader.pages):
        page_text = page.extract_text()
        if page_text:
            text += page_text
        if (i + 1) % 10 == 0:
            print(f"  Processed {i + 1}/{len(reader.pages)} pages...")

    print(f"Total characters extracted: {len(text)}")

    print("Chunking text...")
    chunks = chunk_text(text)
    print(f"Total chunks: {len(chunks)}")

    print("Creating embeddings (this may take a few minutes on CPU)...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(chunks, show_progress_bar=True, batch_size=32)

    print("Saving FAISS index...")
    import faiss
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings, dtype=np.float32))
    faiss.write_index(index, str(OUTPUT_DIR / "aptitude.index"))

    np.save(str(OUTPUT_DIR / "chunks.npy"), np.array(chunks, dtype=object))

    print(f"\n✅ Index created successfully!")
    print(f"   Index file: {OUTPUT_DIR / 'aptitude.index'}")
    print(f"   Chunks file: {OUTPUT_DIR / 'chunks.npy'}")
    print(f"   Total vectors: {index.ntotal}")

if __name__ == "__main__":
    main()
