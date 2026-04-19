<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lists;
use App\Models\ListDetail;
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

    public function reorderDetai(Request $request)
    {
        foreach ($request->items as $key => $item) {
            ListDetail::where([
                    'id' => $item['id'],
                    'list_id' => $item['list_id']
                ])
                ->update(['display_index' => $key]);
        }
    
        return response()->json(['message' => 'Order updated']);
    }


}
