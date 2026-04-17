<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListRequest;
use App\Http\Requests\UpdateListRequest;
use App\Http\Resources\ListResource;
use App\Models\Lists;
use Illuminate\Http\Request;
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
        $lists = Lists::query()->paginate(100);
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
        return response(new ListResource($list), 201);
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
        $list->delete();

        return response("", 204);
    }
}
