<?php

namespace app\index\model;
use think\Model;
// 软删除功能，需要引入SoftDelete trait
//use traits\model\SoftDelete;

class Userdevice extends Model
{
    // 表名
    //protected $name = 'mydevice';
    protected $name = 'userdevice';
	//protected $table = 'fa_userdevice';
	
	// 软删除功能，需要引入SoftDelete trait
	//use SoftDelete;
    //protected $deleteTime = 'delete_time';
	
	// 只读字段，用来保护某些特殊的字段值不被更改，这个字段的值一旦写入，就无法更改
	//protected $readonly = ['imei','imsi'];
	
	// 自动写入创建和更新的时间戳字段，默认识别为整型int类型
	//protected $autoWriteTimestamp = true;
	
	// 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';
	
	// 获取器的作用是在获取数据的字段值后自动进行处理，例如，我们需要对状态值进行转换
	// 如果想获取原始字段数据 使用getData('status')或者getData()
	public function getIsDisableAttr($value)
    {
		if($value == '1' || $value == 1)
		{
			return 'enable';
		}
		else
		{
			return 'disable';
		}
    }
	
	// 修改器的作用是可以在数据赋值的时候自动进行转换处理
	// 如果想获取原始字段数据 使用getData('status')或者getData()
	public function setSnAttr($value)
    {
        return strtoupper($value); // 保存数据的时候，自动转换成大写
    }
	
	/* public function user()
	{
		return $this->belongsTo('User', 'user_id', 'id');
	} */
}
