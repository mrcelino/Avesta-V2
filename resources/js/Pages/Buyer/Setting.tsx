import React, { useState } from 'react';

// Definisi tipe data untuk userData
type UserDataType = {
    nama_depan: string;
    nama_belakang: string;
    email: string;
    alamat: string;
    foto: string;
    jenis_kelamin: string;
    bank: string;
    tanggal_lahir: string;
};

const Setting: React.FC = () => {
    const [userData, setUserData] = useState<UserDataType>({
        nama_depan: '',
        nama_belakang: '',
        email: '',
        alamat: '',
        foto: '',
        jenis_kelamin: '',
        bank: '',
        tanggal_lahir: '',
    });

    // Fungsi untuk menangani perubahan input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Fungsi untuk menangani submit formulir
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/update-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                throw new Error('Gagal memperbarui data');
            }
            console.log('Data berhasil diperbarui');
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="nama_depan" value={userData.nama_depan} onChange={handleChange} placeholder="Nama Depan" />
            <input type="text" name="nama_belakang" value={userData.nama_belakang} onChange={handleChange} placeholder="Nama Belakang" />
            <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
            <input type="text" name="alamat" value={userData.alamat} onChange={handleChange} placeholder="Alamat" />
            <input type="text" name="foto" value={userData.foto} onChange={handleChange} placeholder="Foto URL" />
            <input type="text" name="jenis_kelamin" value={userData.jenis_kelamin} onChange={handleChange} placeholder="Jenis Kelamin" />
            <input type="text" name="bank" value={userData.bank} onChange={handleChange} placeholder="Bank" />
            <input type="date" name="tanggal_lahir" value={userData.tanggal_lahir} onChange={handleChange} placeholder="Tanggal Lahir" />
            <button type="submit">Simpan</button>
        </form>
    );
};

export default Setting;
