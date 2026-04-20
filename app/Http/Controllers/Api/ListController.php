<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListRequest;
use App\Http\Requests\UpdateListRequest;
use App\Http\Resources\ListResource;
use App\Models\Lists;
use App\Models\ListDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filters = (object) $request->all();
        $whereClause = [];


        if (isset($filters->user_id) && $filters->user_id != '') {
            $whereClause[] = ['user_id', $filters->user_id];
        }

        if (isset($filters->description) && $filters->description != '') {
            $whereClause[] = ['description', 'LIKE', ''.$filters->description.'%'];
        }

        $whereClause[] = ['user_id', Auth::user()->id];

        if (isset($filters->id) && $filters->id != '') {
            $whereClause[] = ['id', $filters->id];
            $lists = Lists::query()->select()->where($whereClause)
                ->with(['listDetail' => function ($query) {
                    $query->select('id', 'list_id', 'description', 'display_index');
                }])
            ->orderBy('display_index')->get();
        } else {
            $lists = Lists::query()->where($whereClause)->orderBy('display_index')->paginate(20);
        }

        return ListResource::collection($lists);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreListRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreListRequest $request)
    {
        $data = $request->validated();
        $list = Lists::create($data);
        return response(new ListResource($list->load('listDetail')), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Lists  $list
     * @return \Illuminate\Http\Response
     */
    public function show(Lists $list)
    {
        return new ListResource($list);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateListRequest  $request
     * @param  \App\Models\Lists  $list
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateListRequest $request, Lists $list)
    {
        $data = $request->validated();
        $list->update($data);

        return new ListResource($list);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Lists  $list
     * @return \Illuminate\Http\Response
     */
    public function destroy(Lists $list)
    {
        ListDetail::where('list_id', $list->id)->delete();
        $list->delete();

        return response("", 204);
    }
}
