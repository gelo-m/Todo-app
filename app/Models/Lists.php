<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lists extends Model
{
    use HasFactory;

    protected $table = 'list';

    protected $fillable = [
        'user_id',
        'display_index',
        'description',
    ];

    public function listDetail()
    {
        return $this->hasMany(ListDetail::class, 'list_id', 'id')->orderBy('display_index', 'asc');
    }

}
