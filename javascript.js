// Konfigurasi Nomor WhatsApp (Gunakan format 62 tanpa tanda +)
const NOMOR_WHATSAPP = "6283183104080"; 

// Data Harga Resmi berdasarkan Ukuran Kemasan
const HARGA = {
    '200g': 13000,
    '400g': 25000
};

let cart = [];

// Format Angka ke Standar Rupiah
function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

/**
 * Memperbarui harga yang tampil di kotak produk secara dinamis
 * sesuai ukuran yang dipilih pada dropdown
 */
function updatePrice(productKey) {
    const sizeSelect = document.getElementById(`size-${productKey}`);
    const priceDisplay = document.getElementById(`price-${productKey}`);
    
    if (sizeSelect && priceDisplay) {
        const selectedSize = sizeSelect.value;
        priceDisplay.innerText = formatRupiah(HARGA[selectedSize]);
    }
}

// Buka/Tutup Drawer Keranjang
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    const panel = document.getElementById('cart-panel');

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
function addToCart(namaProduk, idRasa, idUkuran, fotoProduk) {
    const rasa = document.getElementById(idRasa).value;
    const ukuran = document.getElementById(idUkuran).value;
    const harga = HARGA[ukuran];

    const item = {
        id: Date.now(),
        nama: namaProduk,
        rasa: rasa,
        ukuran: ukuran,
        harga: harga,
        foto: fotoProduk
    };

    cart.push(item);
    renderCart();
    toggleCart();
}

// Hapus item tertentu dari keranjang
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Render ulang elemen item di dalam drawer keranjang
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartCount.innerText = cart.length;

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
        total += item.harga;
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm';
        div.innerHTML = `
            <img src="${item.foto}" alt="${item.nama}" class="w-14 h-14 object-cover rounded-lg border border-gray-200">
            <div class="flex-1">
                <h4 class="font-bold text-gray-800 text-sm">${item.nama} (${item.ukuran})</h4>
                <p class="text-xs text-gray-500">Rasa: <span class="font-medium text-brandRed">${item.rasa}</span></p>
                <p class="text-xs font-bold text-gray-800 mt-1">${formatRupiah(item.harga)}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-600 p-2 text-sm transition-colors" title="Hapus">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = formatRupiah(total);
}

// Kirim rincian pesanan ke WhatsApp
function checkoutWA() {
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }

    let pesan = "Halo *Tirsopjon Snack*, saya mau pesan snack:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        pesan += `${index + 1}. *${item.nama}*\n`;
        pesan += `   • Ukuran: ${item.ukuran}\n`;
        pesan += `   • Rasa: ${item.rasa}\n`;
        pesan += `   • Harga: ${formatRupiah(item.harga)}\n\n`;
        total += item.harga;
    });

    pesan += `=========================\n`;
    pesan += `*Total Belanja:* ${formatRupiah(total)}\n`;
    pesan += `=========================\n\n`;
    pesan += "Mohon diproses ya kak, terima kasih!";

    const url = `https://wa.me/${NOMOR_WHATSAPP}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
}

// Inisialisasi harga saat pertama kali halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    updatePrice('pangsit');
    updatePrice('makaroni');
});