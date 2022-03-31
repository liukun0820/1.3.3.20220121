# 1.3.3.20220121
Fastadmin 学习记录

将fa_userdevice.sql导入数据库

在fa_userdevie.sql加入关联用户

以下2步加大upload上传文件大小：

第一步：修改application\extra\upload.php

 'maxsize'   => '1024mb',
 
第二步：修改php.ini，重启服务

post_max_size=1024M

memory_limit = 1024M

upload_max_filesize=1024M
