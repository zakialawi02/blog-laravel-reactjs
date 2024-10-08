<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->onUpdate('cascade')->nullOnDelete();
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->nullOnDelete();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->string('slug')->unique();
            $table->string('excerpt', 2048)->nullable();
            $table->string('cover')->nullable();
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->string('meta_title', 100)->nullable();
            $table->string('meta_description', 300)->nullable();
            $table->string('meta_keywords', 255)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('created_at')->useCurrent()->nullable();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
