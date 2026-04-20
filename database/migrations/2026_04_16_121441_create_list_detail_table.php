<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $table = 'list_detail';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table, function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('list_id');
            $table->bigInteger('display_index');
            $table->mediumText('description');
            $table->boolean('is_complete')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('list_id');
            $table->index(['list_id', 'display_index']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists($this->table);
    }
};
