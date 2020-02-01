-- 获取上报数据
ngx.req.read_body()
local data = ngx.req.get_body_data()
ngx.var.bee_log_obj = data
ngx.var.bee_log_stm = os.time()
ngx.say("1")