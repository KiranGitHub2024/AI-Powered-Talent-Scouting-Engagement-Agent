import pdfplumber
import pandas as pd
from docx import Document


# -----------------------------
# 🔹 PDF (UNCHANGED ✅)
# -----------------------------
def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


# -----------------------------
# 🔹 TXT
# -----------------------------
def extract_text_from_txt(file):
    try:
        return file.read().decode("utf-8")
    except:
        return file.read().decode("latin-1")


# -----------------------------
# 🔹 CSV
# -----------------------------
def extract_text_from_csv(file):
    df = pd.read_csv(file)
    return df.astype(str).to_string()


# -----------------------------
# 🔹 EXCEL (XLS / XLSX)
# -----------------------------
def extract_text_from_excel(file):
    df = pd.read_excel(file)
    return df.astype(str).to_string()


# -----------------------------
# 🔹 DOCX (NEW 🔥)
# -----------------------------
def extract_text_from_docx(file):
    doc = Document(file)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text


# -----------------------------
# 🔹 MAIN ROUTER
# -----------------------------
def extract_text(file, filename):
    filename = filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file)

    elif filename.endswith(".txt"):
        return extract_text_from_txt(file)

    elif filename.endswith(".csv"):
        return extract_text_from_csv(file)

    elif filename.endswith(".xls") or filename.endswith(".xlsx"):
        return extract_text_from_excel(file)

    elif filename.endswith(".docx"):  # 🔥 NEW
        return extract_text_from_docx(file)

    else:
        raise ValueError(f"Unsupported file type: {filename}")