;(function(){
	'use strict'
	
	function copy(obj){
		return Object.assign({},obj);
	};
	var Event=new Vue();
	
	Vue.component('task',{
		template:"#task-tal",
		methods:{
			action:function(name,params){
				Event.$emit(name,params);
			}
		},
		props:['todo']
	});
	
    let vm=new Vue({
  	el:'#app',
  	data:{
  		toList:[],
  		last_id:0,
  		current:{},
  	},
  	
  	mounted:function(){
  		var This=this;
  		this.toList=ms.get('toList') || this.toList;
  		this.last_id=ms.get('last_id')|| this.last_id;
  		
  		setInterval(function(){
  			This.check_alerts();
  		},1000);
  				
  		Event.$on('toogle_complete',function(id){
  			if(id){
  				This.toogle_complete(id);
  			}
  		});
  		
  		Event.$on('remove',function(id){
  			if(id){
  				This.remove(id);
  			}
  		});
  		
  		Event.$on('set_current',function(id){
  			if(id){
  				This.set_current(id);
  			}
  		});
  		
  		Event.$on('toogle_desc',function(id){
  			if(id){
  				This.toogle_desc(id);
  			}
  		});
  	},
  	
  	methods:{
  		check_alerts:function(){
  			var This=this;
  			this.toList.forEach(function(item,i){
  				var alert_at=item.alert_at;
  				if(!alert_at||item.alert_confirm)return
  				var alert_at=(new Date(alert_at)).getTime();
  				var nowTime=(new Date()).getTime();
  				
  				if(nowTime>=alert_at){
  					var confirmed=confirm(item.title);
  					Vue.set(This.toList[i],'alert_confirm',confirmed);
  				};
  			});
  		},
  		merge:function(){
  			var is_updata,id
  			is_updata=id=this.current.id;
  			
  			if(is_updata){
  				var index=this.find_index(id);
  				Vue.set(this.toList,index,copy(this.current));
  				
  			}else{
  			var title=this.current.title;
  			if(!title&&title!==0){return};
  			var todo=copy(this.current);
  			this.last_id++;
  			ms.set('last_id',this.last_id);
  			todo.id=this.last_id;
  			this.toList.push(todo);			
  			};
            this.reset_current();
  		},
  		remove:function(id){
  			var index=this.find_index(id);
  			this.toList.splice(index,1)
  		},
  		set_current:function(todo){
  			this.current=copy(todo);
  		},
  		reset_current:function(){
  			this.set_current({});
  		},
  		find_index:function(id){
  			return this.toList.findIndex(function(item){
  				return item.id==id;
  			})
  		},
  		toogle_complete:function(id){
  			var index=this.find_index(id);
  			Vue.set(this.toList[index],'complete',!this.toList[index].complete);
  		},
  		toogle_desc:function(id){
  			var index=this.find_index(id);
  			Vue.set(this.toList[index],'desc_show',!this.toList[index].desc_show);
  		}
  	},
  	watch:{
  		toList:{
  			deep:true,
  			handler:function(n,o){
  				if(n){
  					ms.set('toList',n);
  				}else{
  					ms.set('toList',[]);
  			  }
  		   }
  		}
  	}
  })
})();
