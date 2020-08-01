"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/classNames"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}(0,_baseComponent.default)({properties:{prefixCls:{type:String,value:"wux-segment"},theme:{type:String,value:"balanced"},defaultCurrent:{type:Number,value:0},current:{type:Number,value:0,observer:function(e){this.data.controlled&&this.setData({activeKey:e})}},values:{type:Array,value:[]},disabled:{type:Boolean,value:!1},controlled:{type:Boolean,value:!1}},data:{activeKey:0},computed:{classes:["prefixCls, theme, disabled",function(e,t,a){var r;return{wrap:(0,_classNames2.default)(e,(_defineProperty(r={},"".concat(e,"--").concat(t),t),_defineProperty(r,"".concat(e,"--disabled"),a),r)),item:"".concat(e,"__item")}}]},methods:{onTap:function(e){this.data.disabled||this.setActiveKey(e.currentTarget.dataset.index)},emitEvent:function(e){this.triggerEvent("change",{key:e,values:this.data.values})},setActiveKey:function(e){this.data.activeKey!==e&&(this.data.controlled||this.setData({activeKey:e})),this.emitEvent(e)}},attached:function(){var e=this.data,t=e.defaultCurrent,a=e.current,r=e.controlled?a:t;this.data.activeKey!==r&&this.setData({activeKey:r})}});