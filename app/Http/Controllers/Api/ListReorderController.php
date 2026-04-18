<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lists;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class ListReorderController extends Controller
{
    public function reorder(Request $request)
    {
        foreach ($request->items as $key => $item) {
            Lists::where('id', $item['id'])
                ->update(['display_index' => $key]);
        }
    
        return response()->json(['message' => 'Order updated']);
    }

}
