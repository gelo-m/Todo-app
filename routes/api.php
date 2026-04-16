<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    // Route::get('/user', function (Request $request) {
    //     // return $request->user();

    //     return new UserResource(
    //         $request->user()->load('lists')
    //     );
        
    // });

    Route::get('/user', [UserController::class, 'current']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/lists', ListController::class);
});


Route::post('signup', [AuthController::class, 'signup']);
Route::post('login', [AuthController::class, 'login']);
