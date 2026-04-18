<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ListDetailResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'list_id' => $this->list_id,
            'display_index' => $this->display_index,
            'description' => $this->description,
            'is_complete' => $this->is_complete ? 1 : 0,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
