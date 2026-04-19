<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Lists;
use App\Models\ListDetail;
use App\Models\User;

class ListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::truncate(); 
        Lists::truncate(); 
        ListDetail::truncate(); 

        $user = User::create([
            'name' => "User",
            'email' => "user@test.com",
            'password' =>  bcrypt("User@12345")
        ]);

        for ($parent = 0; $parent <= 99; $parent++) {
            $list = Lists::create([
                'user_id' => $user->id,
                'display_index' => $parent,
                'description' => "Title ". $parent
            ]);

            for ($child = 0; $child <= 4; $child++) {
                ListDetail::create([
                    'list_id' => $list->id,
                    'display_index' => $child,
                    'description' => "Sub Title ". $child
                ]);
            }
        }
    }
}
