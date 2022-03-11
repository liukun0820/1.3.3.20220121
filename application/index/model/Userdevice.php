<?php

namespace app\index\model;
use think\Model;

class Userdevice extends Model
{
    // 表名
    //protected $name = 'mydevice';
    protected $name = 'userdevice';
	//protected $table = 'fa_userdevice';
	
	// 获取器的作用是在获取数据的字段值后自动进行处理，例如，我们需要对状态值进行转换
	public function getIsDisableAttr($value)
    {
        $status = [0=>'禁用',1=>'正常'];
        return $status[$value];
    }
	
	// 修改器的作用是可以在数据赋值的时候自动进行转换处理
	public function setSnAttr($value)
    {
        return strtoupper($value); // 保存数据的时候，自动转换成大写
    }
	
	/* public function user()
	{
		return $this->belongsTo('User', 'user_id', 'id');
	} */
}
