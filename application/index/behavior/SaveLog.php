<?php

namespace app\index\behavior;

class SaveLog
{
    public function run(&$params)
    {
        //只记录POST请求的日志
        //if (request()->isPost() && config('fastadmin.auto_record_log')) {
            \app\index\model\SaveLog::record();
        //}
    }
}
