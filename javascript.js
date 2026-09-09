// Konfigurasi Nomor WhatsApp & Media Sosial
const NOMOR_WHATSAPP = "6283183104080"; 
const USERNAME_INSTAGRAM = "tirsopjon.snack"; // Ganti dengan username IG kamu
const USERNAME_TIKTOK = "tirsopjon.snack";    // Ganti dengan username TikTok kamu

// Data Harga Resmi berdasarkan Ukuran Kemasan
const HARGA = {
    '200g': 13000,
    '400g': 25000
};

let cart = [];
let isPlaying = false;

/* --- FUNGSI REDIRECT MEDIA SOSIAL --- */
function openInstagram() {
    window.open(`https://www.instagram.com/tirsopjonsnack.id?stkn=cnM4ejRqYXR6MjRv"`, '_blank');
}

function openTikTok() {
    window.open(`https://www.tiktok.com/@tirsopjonsnack.id?_r=1&_t=ZS-99abmcO9G3U`, '_blank');
}

/* --- FUNGSI DARK MODE --- */
function initTheme() {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    const isDark = localStorage.getItem('color-theme') === 'dark' || 
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
    }
}

function toggleDarkMode() {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (themeToggleDarkIcon && themeToggleLightIcon) {
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');
    }

    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
}

/* --- FUNGSI MUSIK LATAR --- */
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');
    const musicPulse = document.getElementById('music-pulse');
    const musicStatus = document.getElementById('music-status');

    if (!music) return;

    if (isPlaying) {
        music.pause();
        if (musicIcon) musicIcon.className = "fas fa-music text-xl";
        if (musicPulse) musicPulse.classList.add("hidden");
        if (musicStatus) musicStatus.innerText = "Putar Musik 🎵";
        isPlaying = false;
    } else {
        music.play().then(() => {
            if (musicIcon) musicIcon.className = "fas fa-compact-disc text-2xl animate-spin-slow";
            if (musicPulse) musicPulse.classList.remove("hidden");
            if (musicStatus) musicStatus.innerText = "Jeda Musik ⏸️";
            isPlaying = true;
        }).catch(err => {
            console.log("Autoplay dicegah oleh browser:", err);
        });
    }
}

/* --- FUNGSI TOAST NOTIFIKASI --- */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;

    toastMessage.innerText = message;
    toast.classList.remove('translate-x-full', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 2500);
}

// Format Angka ke Standar Rupiah
function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

/**
 * Memperbarui gambar produk secara dinamis berdasarkan varian rasa yang dipilih
 */
function updateProductImage(productKey) {
    const rasaSelect = document.getElementById(`flavor-${productKey}`);
    const cardImg = document.getElementById(`card-img-${productKey}`);
    
    if (rasaSelect && cardImg) {
        const selectedOption = rasaSelect.options[rasaSelect.selectedIndex];
        const newImgSrc = selectedOption.getAttribute('data-img');
        if (newImgSrc) {
            cardImg.src = newImgSrc;
        }
    }
}

/**
 * Memperbarui harga yang tampil di kotak produk secara dinamis sesuai ukuran yang dipilih
 */
function updatePrice(productKey) {
    const sizeSelect = document.getElementById(`size-${productKey}`);
    const priceDisplay = document.getElementById(`price-${productKey}`);
    
    if (sizeSelect && priceDisplay) {
        const selectedSize = sizeSelect.value;
        if (HARGA[selectedSize]) {
            priceDisplay.innerText = formatRupiah(HARGA[selectedSize]);
        }
    }
}

/**
 * Penyesuaian jumlah (Quantity) di tampilan produk
 */
function adjustQty(productKey, amount) {
    const qtyEl = document.getElementById(`qty-${productKey}`);
    if (!qtyEl) return;

    let currentQty = parseInt(qtyEl.innerText) || 1;
    currentQty += amount;
    if (currentQty < 1) currentQty = 1;
    qtyEl.innerText = currentQty;
}

// Buka/Tutup Drawer Keranjang
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    const panel = document.getElementById('cart-panel');

    if (!drawer || !backdrop || !panel) return;

    if (drawer.classList.contains('pointer-events-none')) {
        drawer.classList.remove('pointer-events-none');
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('translate-x-full');
    } else {
        drawer.classList.add('pointer-events-none');
        backdrop.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
    }
}

// Menambahkan item ke keranjang belanja
function addToCart(namaProduk, idRasa, idUkuran, idQty) {
    const rasaEl = document.getElementById(idRasa);
    const ukuranEl = document.getElementById(idUkuran);
    const qtyEl = document.getElementById(idQty);

    if (!rasaEl || !ukuranEl || !qtyEl) return;

    const selectedOption = rasaEl.options[rasaEl.selectedIndex];
    const rasa = rasaEl.value;
    const ukuran = ukuranEl.value;
    const harga = HARGA[ukuran];
    const qty = parseInt(qtyEl.innerText) || 1;
    
    const fotoProduk = selectedOption.getAttribute('data-img') || (namaProduk.includes('Pangsit') ? 'pangsitt.jpeg' : 'makaroni.jpeg');

    const existingIndex = cart.findIndex(item => item.nama === namaProduk && item.rasa === rasa && item.ukuran === ukuran);

    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        const item = {
            id: Date.now(),
            nama: namaProduk,
            rasa: rasa,
            ukuran: ukuran,
            harga: harga,
            qty: qty,
            foto: fotoProduk
        };
        cart.push(item);
    }

    renderCart();
    showToast(`${namaProduk} (${qty}x) berhasil ditambahkan!`);
    qtyEl.innerText = '1';
}

// Ubah jumlah item dari dalam keranjang
function changeCartQty(id, amount) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        cart[index].qty += amount;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        renderCart();
    }
}

// Hapus item dari keranjang
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Render ulang item di dalam drawer keranjang
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    const totalItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.innerText = totalItemsCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-10 text-gray-400">
                <i class="fas fa-shopping-basket text-4xl mb-3 opacity-40"></i>
                <p class="text-sm">Keranjang belanja Anda masih kosong.</p>
            </div>
        `;
        cartTotal.innerText = 'Rp 0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.harga * item.qty;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm';
        div.innerHTML = `
            <img src="${item.foto}" alt="${item.nama}" class="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700" onerror="this.src='LOGO.png'">
            <div class="flex-1">
                <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm">${item.nama} (${item.ukuran})</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">Rasa: <span class="font-medium text-brandRed">${item.rasa}</span></p>
                <p class="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">${formatRupiah(itemTotal)}</p>
            </div>
            <div class="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
                <button onclick="changeCartQty(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center font-bold text-xs">-</button>
                <span class="text-xs font-bold px-1">${item.qty}</span>
                <button onclick="changeCartQty(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center font-bold text-xs">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 text-sm transition-colors" title="Hapus">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = formatRupiah(total);
}

// Kirim rincian pesanan dan detail pemesan ke WhatsApp
function checkoutWA() {
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }

    const nameInput = document.getElementById('cust-name');
    const addressInput = document.getElementById('cust-address');
    const notesInput = document.getElementById('cust-notes');

    const name = nameInput ? nameInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!name || !address) {
        alert('Mohon isi Nama Lengkap dan Alamat Pengiriman terlebih dahulu!');
        return;
    }

    let pesan = "Halo *Tirsopjon Snack*, saya mau pesan snack:\n\n";
    pesan += `*Nama Pemesan:* ${name}\n`;
    pesan += `*Alamat:* ${address}\n`;
    if (notes) pesan += `*Catatan:* ${notes}\n`;
    pesan += `-----------------------------------------\n\n`;

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.harga * item.qty;
        pesan += `${index + 1}. *${item.nama}*\n`;
        pesan += `   • Ukuran: ${item.ukuran}\n`;
        pesan += `   • Rasa: ${item.rasa}\n`;
        pesan += `   • Jumlah: ${item.qty} x ${formatRupiah(item.harga)} = ${formatRupiah(subtotal)}\n\n`;
        total += subtotal;
    });

    pesan += `=========================\n`;
    pesan += `*Total Belanja:* ${formatRupiah(total)}\n`;
    pesan += `=========================\n\n`;
    pesan += "Mohon diproses ya kak, terima kasih!";

    const url = `https://wa.me/${NOMOR_WHATSAPP}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
}

// Inisialisasi awal saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updatePrice('pangsit');
    updatePrice('makaroni');
});