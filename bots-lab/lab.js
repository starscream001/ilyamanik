'use strict';
const scenarios = {
 booking: [
  {sender:'Клиент',type:'client',text:'Хочу записаться на консультацию.'},
  {sender:'Бот',text:'Помогу с записью. Выберите услугу и удобное время из расписания.'},
  {sender:'Клиент',type:'client',text:'Консультация. Вторник, 14:00.'},
  {sender:'Пример результата',type:'result',text:'Услуга и время собраны. После подтверждения и подключения к расписанию бот создаёт запись и передаёт информацию команде.'}
 ],
 lead: [
  {sender:'Клиент',type:'client',text:'Нужен расчёт стоимости проекта.'},
  {sender:'Бот',text:'Расскажите, что хотите сделать, и оставьте удобный способ связи. Передам менеджеру.'},
  {sender:'Клиент',type:'client',text:'Нужен сайт для мастерской. Удобно связаться в Telegram.'},
  {sender:'Пример результата',type:'result',text:'В заявке есть задача и способ связи. Менеджер получает контекст и может начать разговор по делу.'}
 ],
 support: [
  {sender:'Клиент',type:'client',text:'Как подготовиться к консультации?'},
  {sender:'Бот',text:'Опишите вашу задачу и соберите материалы, которые помогут её обсудить. Если вопрос нестандартный, подключу менеджера.'},
  {sender:'Клиент',type:'client',text:'Мне нужно обсудить индивидуальные условия.'},
  {sender:'Пример результата',type:'result',text:'Бот передаёт обращение человеку вместе с историей диалога. Сложный вопрос не остаётся в автоматическом сценарии.'}
 ]
};
const log=document.querySelector('.chat-log');
if(log){
 let scenario='booking'; let visible=2;
 const progress=document.querySelector('.demo-progress');
 const next=document.querySelector('.demo-next');next.hidden=false;
 const tabs=[...document.querySelectorAll('[data-scenario]')];
 function render(){
  log.replaceChildren();
  scenarios[scenario].slice(0,visible).forEach(item=>{
   const message=document.createElement('div');message.className=`chat-message ${item.type||''}`;
   const sender=document.createElement(item.type==='result'?'strong':'span');sender.className='sender';sender.textContent=item.sender;
   const text=document.createElement('p');text.textContent=item.text;message.append(sender,text);log.append(message);
  });
  progress.textContent=`Шаг ${visible-1} из 3`;
  next.textContent=visible===4?'Начать заново ↻':'Дальше →';
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>{
   scenario=tab.dataset.scenario;visible=2;
   tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
   document.querySelector('#demo-panel').setAttribute('aria-labelledby',tab.id);render();
  });
  tab.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();
   const target=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
   tabs[target].focus();tabs[target].click();
  });
 });
 next.addEventListener('click',()=>{visible=visible===4?2:visible+1;render();});render();
}
document.querySelectorAll('[data-variant]').forEach(link=>{
 if(location.pathname===link.pathname)link.setAttribute('aria-current','page');
});
