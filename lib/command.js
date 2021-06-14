let command_task_list = [
  'dash',
  'monitors',
  'profiles',
  'accounts',
  'proxies',
  'tasks',
  'raffle',
  'harvest',
  'gather_products',
];
let command_task_obj = Object.assign({}, command_task_list);
var task_value_id = {};
Object.keys(command_task_obj).forEach((key) => {
  task_value_id[command_task_obj[key]] = key;
});



module.exports = {
  command_task_list: command_task_list,
  command_task_obj: command_task_obj,
  task_value_id: task_value_id,
};