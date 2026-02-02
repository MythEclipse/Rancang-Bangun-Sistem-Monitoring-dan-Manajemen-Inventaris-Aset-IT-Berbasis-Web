#!/usr/bin/env python3
"""
Script untuk menggabungkan Cover.docx ke awal laporan-proyek.docx dengan python-docx.
"""
from pathlib import Path
from docx import Document
from docx.oxml import OxmlElement
from copy import deepcopy

def merge_cover_with_report_proper(cover_path, report_path, output_path=None):
    """
    Gabungkan Cover.docx ke awal laporan dengan python-docx.
    Preservasi semua elemen termasuk gambar, styling, dan formatting.
    """
    cover_path = Path(cover_path)
    report_path = Path(report_path)
    
    if output_path is None:
        output_path = report_path
    
    if not cover_path.exists():
        print(f"Error: Cover file not found: {cover_path}")
        return False
    
    if not report_path.exists():
        print(f"Error: Report file not found: {report_path}")
        return False
    
    print("Menggabungkan Cover.docx ke awal laporan (python-docx)...")
    
    # Load dokumen
    cover_doc = Document(cover_path)
    report_doc = Document(report_path)
    
    # Copy semua paragraph dari cover ke awal report
    cover_elements = list(cover_doc.element.body)
    report_body = report_doc.element.body
    
    # Tunggu sebelum insert, kumpulkan elemen yang akan di-copy
    elements_copy = [deepcopy(elem) for elem in cover_elements]
    
    # Insert semua elemen cover di awal report
    for i, elem in enumerate(elements_copy):
        report_body.insert(i, elem)
    
    print(f"✓ {len(elements_copy)} elemen dari cover ditambahkan")
    
    # Tambahkan page break setelah cover
    p_after_cover = report_body[len(elements_copy)]
    pPr = p_after_cover.get_or_add_pPr()
    pPgBr = OxmlElement('w:pageBreakBefore')
    pPr.append(pPgBr)
    
    # Simpan
    report_doc.save(output_path)
    print(f"✅ Cover berhasil ditambahkan ke awal laporan: {output_path}")
    print(f"   Total elemen: {len(list(report_doc.element.body))}")
    return True

if __name__ == '__main__':
    root = Path(__file__).parent.parent / 'docs'
    cover_file = root / 'Cover.docx'
    report_file = root / 'laporan-proyek.docx'
    
    merge_cover_with_report_proper(cover_file, report_file)
