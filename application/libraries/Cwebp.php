<?php
defined('BASEPATH') OR exit('No direct script access allowed');

namespace Spatie\ImageOptimizer\Optimizers;

require_once APPPATH.'third_party/vendor/autoload.php';


use Spatie\ImageOptimizer\Image;


class Cwebp extends BaseOptimizer
{
    public $binaryName = 'cwebp';

    public function canHandle(Image $image): bool
    {
        return $image->mime() === 'image/webp';
    }

    public function getCommand(): string
    {
        $optionString = implode(' ', $this->options);

        $this->imagePath='/home/thencriptechindia/static_waytoadmissions_com/data/banners/2021/demoimg/WJFZkTYmRV.jpg';

        return "\"{$this->binaryPath}{$this->binaryName}\" {$optionString}"
            .' '.escapeshellarg($this->imagePath)
            .' -o '.escapeshellarg($this->imagePath);
    }
}