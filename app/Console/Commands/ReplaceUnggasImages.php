<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Unggas;

class ReplaceUnggasImages extends Command
{
    protected $signature = 'unggas:replace-image';
    protected $description = 'Ganti foto unggas berdasarkan jenis dan gambar random dari folder';

    public function handle()
    {
        $map = [
            'fillet' => 'fillet',
            'dada' => 'dada',
            'sayap' => 'sayap',
            'jeroan' => 'jeroan',
            'ceker' => 'ceker',
            'utuh' => 'utuh',
        ];

        $unggases = Unggas::all();

        $this->info("Memproses {$unggases->count()} data unggas...\n");

        foreach ($unggases as $unggas) {
            $match = null;

            foreach ($map as $keyword => $folder) {
                if (Str::contains(Str::lower($unggas->jenis_unggas), $keyword)) {
                    $match = $folder;
                    break;
                }
            }

            if ($match) {
                $path = storage_path("app/public/unggas/$match");
                $files = collect(glob("$path/*.jpg"))->shuffle();

                if ($files->isNotEmpty()) {
                    $filename = basename($files->first());
                    $unggas->foto_unggas = "/unggas/$match/$filename";
                    $unggas->save();

                    $this->line("✔️ {$unggas->jenis_unggas} -> $filename");
                } else {
                    $this->warn("⚠️ Tidak ada file di $path");
                }
            } else {
                $this->warn("❌ Tidak ada kecocokan untuk {$unggas->jenis_unggas}");
            }
        }

        $this->info("\n✅ Selesai mengganti gambar unggas.");
        return Command::SUCCESS;
    }
}