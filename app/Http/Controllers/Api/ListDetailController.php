<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListDetailRequest;
use App\Http\Requests\UpdateListDetailRequest;
use App\Http\Resources\ListDetailResource;
use App\Models\ListDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ListDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filters = (object) $request->all();
        $listDetailDetail = ListDetail::where(['id' => $filters->id, 'list_id' => $filters->list_id])->get();
        return ListDetailResource::collection($listDetail);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreListDetailRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreListDetailRequest $request)
    {
        $data = $request->validated();
        $listDetail = ListDetail::create($data);
        return response(new ListDetailResource($listDetail), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ListDetail  $listDetail
     * @return \Illuminate\Http\Response
     */
    public function show(Lists $listDetail)
    {
        return new ListDetailResource($listDetail);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateListDetailRequest  $request
     * @param  \App\Models\ListDetail  $listDetail
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateListDetailRequest $request, ListDetail $listDetail)
    {
        $data = $request->validated();
        $data['is_complete'] = $request->is_complete ? 1 : 0;
        $listDetail->update($data);

        return new ListDetailResource($listDetail);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ListDetail  $listDetail
     * @return \Illuminate\Http\Response
     */
    public function destroy(ListDetail $listDetail)
    {
        $listDetail->delete();

        return response("", 204);
    }
}
