document.addEventListener('DOMContentLoaded', () => {
    // Header background change on scroll
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial call
    revealOnScroll();
    
    // Scroll event
    window.addEventListener('scroll', revealOnScroll);

    // Simple Form Submission (Frontend only)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Cảm ơn bạn đã quan tâm đến dự án Lam Vân! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.');
            contactForm.reset();
        });
    }

    // --- LIVE EDIT MODE LOGIC ---
    const toggleEditBtn = document.getElementById('toggle-edit');
    const copyCodeBtn = document.getElementById('copy-code');
    const downloadCodeBtn = document.getElementById('download-code');
    let isEditMode = false;

    if (toggleEditBtn) {
        toggleEditBtn.addEventListener('click', () => {
            isEditMode = !isEditMode;
            
            // Toggle edit mode for all text elements
            const editables = document.querySelectorAll('h1, h2, h3, h4, h5, p, span, .btn, footer p, .copyright');
            editables.forEach(el => {
                if (!el.classList.contains('admin-btn')) {
                    el.contentEditable = isEditMode;
                }
            });

            // Toggle image editing
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (isEditMode) {
                    img.classList.add('editable-img');
                    img.addEventListener('click', handleImageEdit);
                } else {
                    img.classList.remove('editable-img');
                    img.removeEventListener('click', handleImageEdit);
                }
            });

            // Update UI
            if (isEditMode) {
                toggleEditBtn.innerHTML = '<i class="fas fa-check"></i> Xong Chỉnh Sửa';
                toggleEditBtn.classList.add('active');
                if (downloadCodeBtn) downloadCodeBtn.style.display = 'flex';
                copyCodeBtn.style.display = 'flex';
            } else {
                toggleEditBtn.innerHTML = '<i class="fas fa-edit"></i> Bật Chỉnh Sửa';
                toggleEditBtn.classList.remove('active');
                if (downloadCodeBtn) downloadCodeBtn.style.display = 'none';
                copyCodeBtn.style.display = 'none';
            }
        });
    }

    let currentEditingImg = null;
    const imageEditorInput = document.getElementById('image-editor-input');

    function handleImageEdit(e) {
        e.preventDefault();
        currentEditingImg = e.target;
        imageEditorInput.click();
    }

    if (imageEditorInput) {
        imageEditorInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target.result;
                    if (currentEditingImg) {
                        currentEditingImg.src = base64String;
                        
                        // Đồng bộ Logo nếu là ảnh logo
                        if (currentEditingImg.classList.contains('logo-img')) {
                            document.querySelectorAll('.logo-img').forEach(logo => {
                                logo.src = base64String;
                            });
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (downloadCodeBtn) {
        downloadCodeBtn.addEventListener('click', () => {
            const editPanel = document.getElementById('admin-panel');
            const fileInput = document.getElementById('image-editor-input');
            
            // Tạm ẩn panel và xóa input để có file HTML sạch
            editPanel.style.display = 'none';
            if (fileInput) fileInput.remove();

            const htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
            
            // Khôi phục lại giao diện sau khi chụp
            if (fileInput) document.body.appendChild(fileInput);
            editPanel.style.display = 'flex';

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'LamVan_Portfolio_Updated.html';
            a.click();
            URL.revokeObjectURL(url);
            
            alert('Website đã được tải xuống hoàn tất!');
        });
    }

    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const editPanel = document.getElementById('admin-panel');
            const fileInput = document.getElementById('image-editor-input');
            
            editPanel.style.display = 'none';
            if (fileInput) fileInput.remove();

            const htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
            
            if (fileInput) document.body.appendChild(fileInput);
            editPanel.style.display = 'flex';
            
            navigator.clipboard.writeText(htmlContent).then(() => {
                alert('Mã HTML đã được sao chép! Dán lại vào file index.html để lưu.');
            });
        });
    }
});
