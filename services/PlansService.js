var Database = require('../models/index');

class PlansService{
  constructor(){
    this.Plan = Database["Plan"];
  }

  async getAll(){
    try{
      return await this.Plan.findAll();
    }catch{
      return undefined;
    }
  }

  async getById(id){
    try{
      return await this.Plan.findByPk(id);
    }catch{
      return undefined;
    }
  }

    async deactivate(id){
      try{
        var plan = await this.getById(id);
        plan.deactivated = true;
        await plan.save();
        return true;
      }catch(err){
        return false;
      }
    }

  async update(id,data){
    var errors = {};

    var isValid = this.validate(data, errors);

    if(isValid){
        try{
            var plan = await this.getById(id);
            plan.title = data.title;
            plan.list = data.list;
            plan.client = data.client;
            plan.value = data.value;
            await plan.save();
            return true;
        }catch(erro){
            errors.system_msg = "Não foi possível editar o plano!";
            return errors;
        }

    }else{
        return errors;
    }
}

  async store(plans){
    var errors = {};

    if(plans.import != undefined){
      plans.import = true;
    }else{
      plans.import = false;
    }

    var isvalid = this.validate(plans, errors);

    if(isvalid){
      try{
        await this.Plan.create(plans);
        return true;
      }catch(err){
        errors.system_msg = "Unable to save plan!";
        return errors;
      }
    }else{
      return errors;
    }  
  }

  validate(plan, errors){
    var errorCount = 0;
    if(plan.title == undefined){
      errors.title_msg = "Invalid title!";
      errorCount ++;
    }else{
      if(plan.title.length < 3){
        errors.title_msg = "Invalid title!";
        errorCount ++;
      }
    }
    if(plan.list == undefined){
      errors.list_msg = "Invalid quantity of list!";
      errorCount ++;
    }else{
      if(plan.list < 1){
        errors.list_msg = "Invalid quantity of list!";
        errorCount ++;
      }
    }
    if(errorCount == 0){
      return true;
    }else{
      return false;
    }
  }
}

module.exports = new PlansService();