-- 计算日志名，按天分割;
local path = ngx.var.bee_log_path
ngx.var.bee_log_path = "logs/bee"..os.date("%Y%m%d", os.time())..".log";
-- 因为测试环境没有后续日志处理，故主动删除7天前日志,正式环境按需处理
if path ~= ngx.var.bee_log_path then
    local oldPath = "logs/bee"..os.date("%Y%m%d", os.time() - 86400 * 7)..".log";
    os.remove(oldPath);
end