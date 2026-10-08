const $=s=>document.querySelector(s);
function setPageHeader(title="صفحه اصلی", section="خانه"){
  const contentTitle=document.querySelector("#contentPageTitle");
  const contentCrumb=document.querySelector("#contentPageBreadcrumb");
  if(contentTitle) contentTitle.textContent=title;
  if(contentCrumb) contentCrumb.textContent=section;
}
