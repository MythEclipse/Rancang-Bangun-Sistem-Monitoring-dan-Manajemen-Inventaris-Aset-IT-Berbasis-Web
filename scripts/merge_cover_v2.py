#!/usr/bin/env python3
"""
Script untuk merge Cover.docx dengan laporan-proyek.docx dengan proper image handling.
Approach: Manipulasi DOCX sebagai ZIP dan copy media folder.
"""
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import tempfile
import shutil

def merge_cover_with_images_v2(cover_path, report_path, output_path=None):
    """
    Merge Cover.docx ke laporan dengan proper image handling.
    """
    cover_path = Path(cover_path)
    report_path = Path(report_path)
    
    if output_path is None:
        output_path = report_path
    
    if not cover_path.exists():
        print(f"Error: Cover tidak ditemukan: {cover_path}")
        return False
    
    if not report_path.exists():
        print(f"Error: Report tidak ditemukan: {report_path}")
        return False
    
    print("Merge Cover dengan gambar (ZIP level approach)...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Extract cover dan report
        cover_dir = temp_path / 'cover'
        report_dir = temp_path / 'report'
        output_dir = temp_path / 'output'
        
        cover_dir.mkdir()
        report_dir.mkdir()
        output_dir.mkdir()
        
        # Extract cover
        with ZipFile(cover_path, 'r') as zip_ref:
            zip_ref.extractall(cover_dir)
        
        # Extract report
        with ZipFile(report_path, 'r') as zip_ref:
            zip_ref.extractall(report_dir)
        
        print("✓ Cover dan report extracted")
        
        # Copy semua file dari report ke output
        shutil.copytree(report_dir, output_dir, dirs_exist_ok=True)
        
        # Copy media dari cover ke output
        cover_media = cover_dir / 'word' / 'media'
        output_media = output_dir / 'word' / 'media'
        
        if cover_media.exists():
            output_media.mkdir(exist_ok=True)
            for media_file in cover_media.iterdir():
                shutil.copy(media_file, output_media / media_file.name)
                print(f"✓ Copied media: {media_file.name}")
        
        # Parse dan merge document.xml
        cover_doc_xml = cover_dir / 'word' / 'document.xml'
        output_doc_xml = output_dir / 'word' / 'document.xml'
        
        ET.register_namespace('', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        ET.register_namespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        ET.register_namespace('wp', 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing')
        ET.register_namespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main')
        ET.register_namespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        
        cover_tree = ET.parse(cover_doc_xml)
        output_tree = ET.parse(output_doc_xml)
        
        cover_root = cover_tree.getroot()
        output_root = output_tree.getroot()
        
        # Ambil namespace
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # Dapatkan body elements
        cover_body_elems = list(cover_root.find('w:body', ns))
        output_body = output_root.find('w:body', ns)
        
        # Copy semua elemen cover (except last element yang biasanya sectPr) ke awal output
        for i, elem in enumerate(cover_body_elems[:-1]):  # Skip last sectPr
            import copy
            new_elem = copy.deepcopy(elem)
            output_body.insert(i, new_elem)
        
        print(f"✓ {len(cover_body_elems)-1} elemen dari cover ditambahkan")
        
        # Save merged document.xml
        output_tree.write(output_doc_xml, encoding='utf-8', xml_declaration=True)
        
        # Copy relationships dari cover ke output jika ada gambar
        cover_rels = cover_dir / 'word' / '_rels' / 'document.xml.rels'
        output_rels = output_dir / 'word' / '_rels' / 'document.xml.rels'
        
        if cover_rels.exists():
            ET.register_namespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
            
            cover_rels_tree = ET.parse(cover_rels)
            output_rels_tree = ET.parse(output_rels)
            
            cover_rels_root = cover_rels_tree.getroot()
            output_rels_root = output_rels_tree.getroot()
            
            # Copy image relationships dari cover
            ns_rels = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
            
            for rel in cover_rels_root.findall('r:Relationship', ns_rels):
                rel_type = rel.get('Type', '')
                if 'image' in rel_type:
                    import copy
                    new_rel = copy.deepcopy(rel)
                    output_rels_root.append(new_rel)
                    print(f"✓ Relationship copied: {rel.get('Id')}")
            
            output_rels_tree.write(output_rels, encoding='utf-8', xml_declaration=True)
        
        print("✓ Relationships merged")
        
        # Repackage sebagai DOCX
        with ZipFile(output_path, 'w') as zip_ref:
            for file_path in output_dir.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(output_dir)
                    zip_ref.write(file_path, arcname)
        
        print(f"\n✅ Cover dengan gambar berhasil di-merge: {output_path}")
    
    return True

if __name__ == '__main__':
    root = Path(__file__).parent.parent / 'docs'
    cover_file = root / 'Cover.docx'
    report_file = root / 'laporan-proyek.docx'
    
    # Backup report asli dulu
    backup_file = root / 'laporan-proyek.backup.docx'
    if not backup_file.exists() and report_file.exists():
        shutil.copy(report_file, backup_file)
        print(f"✓ Backup created: {backup_file}")
    
    merge_cover_with_images_v2(cover_file, report_file)
