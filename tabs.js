// 辅助函数：从URL中提取域名
function extractDomain(url) {
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch (error) {
    domain = '其他';
  }
  return domain || '其他';
}

// 存储所有标签页的信息
let allTabs = [];

// 获取当前窗口的所有标签页信息，按域名分组，并渲染到popup.html
function displayTabs(filter = '') {
  chrome.tabs.query({ currentWindow: true, status: 'complete' }, (tabs) => {
    allTabs = tabs;
    renderTabs(filter);
  });
}

// 渲染标签页列表
function renderTabs(filter = '') {
  const tabList = document.getElementById('tab-list');
  if (!tabList) {
    return;
  }
  tabList.innerHTML = '';

  // 按域名对标签页进行分组
  const groupedTabs = {};
  allTabs.forEach((tab) => {
    if (filter && !tab.title.toLowerCase().includes(filter.toLowerCase())) {
      return;
    }
    const domain = extractDomain(tab.url);
    if (!groupedTabs[domain]) {
      groupedTabs[domain] = [];
    }
    groupedTabs[domain].push(tab);
  });

  // 渲染分组后的标签页
  for (const [domain, domainTabs] of Object.entries(groupedTabs)) {
    const domainGroup = document.createElement('div');
    domainGroup.className = 'domain-group';

    const domainHeader = document.createElement('h2');
    domainHeader.textContent = domain;
    domainGroup.appendChild(domainHeader);

    const domainList = document.createElement('ul');
    domainTabs.forEach((tab) => {
      const tabItem = document.createElement('li');
      tabItem.className = 'tab-item';
      
      const favicon = document.createElement('img');
      favicon.src = tab.favIconUrl || 'default-favicon.png';
      favicon.className = 'tab-favicon';
      favicon.width = 16;
      favicon.height = 16;
      
      const titleSpan = document.createElement('span');
      titleSpan.className = 'tab-title';
      titleSpan.textContent = tab.title || tab.url || '无标题';
      
      tabItem.appendChild(favicon);
      tabItem.appendChild(titleSpan);
      
      tabItem.title = tab.title || tab.url || '无标题';
      
      tabItem.addEventListener('click', () => {
        chrome.tabs.update(tab.id, { active: true });
        window.close();
      });
      
      domainList.appendChild(tabItem);
    });

    domainGroup.appendChild(domainList);
    tabList.appendChild(domainGroup);
  }
}

// 初始化函数
function init() {
  chrome.tabs.query({ currentWindow: false }, (tabs) => {
    allTabs = tabs;
    renderTabs();
  });

  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', (e) => {
    renderTabs(e.target.value);
  });
}

// 当popup页面加载完成时执行init函数
document.addEventListener('DOMContentLoaded', init);

// 添加一个定时器，延迟执行displayTabs
setTimeout(displayTabs, 500);
