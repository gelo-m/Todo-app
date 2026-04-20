<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Lists;
use App\Models\ListDetail;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('list_detail')->truncate();
        DB::table('list')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        DB::connection()->disableQueryLog();
        
        $userId = DB::table('users')->insertGetId([
            'name' => 'User',
            'email' => 'user@test.com',
            'password' => bcrypt('User@12345'),
        ]);
        
        $listChunk = 5000;
        $detailChunk = 1000;
        
        for ($i = 0; $i < 1000000; $i += $listChunk) {
        
            $lists = [];
        
            for ($j = 0; $j < $listChunk && ($i + $j) < 1000000; $j++) {
                $index = $i + $j;
        
                $lists[] = [
                    'user_id' => $userId,
                    'display_index' => $index,
                    'description' => "Title $index",
                    'created_at' => date('Y-m-d')
                ];
            }
        
            DB::table('list')->insert($lists);
        
            $listIds = DB::table('list')
                ->orderBy('id', 'desc')
                ->limit(count($lists))
                ->pluck('id')
                ->reverse()
                ->values();
        
            $details = [];
        
            foreach ($listIds as $listId) {
                for ($child = 0; $child < 5; $child++) {
                    $details[] = [
                        'list_id' => $listId,
                        'display_index' => $child,
                        'description' => "Sub Title $child",
                        'created_at' => date('Y-m-d')
                    ];
        
                    if (count($details) >= $detailChunk) {
                        DB::table('list_detail')->insert($details);
                        $details = [];
                    }
                }
            }
        
            if (!empty($details)) {
                DB::table('list_detail')->insert($details);
            }
        
            echo "Inserted: " . ($i + $listChunk) . PHP_EOL;
        }
    }
}
