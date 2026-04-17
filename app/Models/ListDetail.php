<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListDetail extends Model
{
    use HasFactory;

    protected $table = 'list_detail';

    protected $fillable = [
        'list_id',
        'display_index',
        'description',
        'is_complete'
    ];
}
