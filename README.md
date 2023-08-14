# 投票網的框架為 NextJs 13version

使用13版app資料夾的路由架構，免去額外的路由設置。
根目錄的Loading組件與Error組件，提供所以子路由引用。
首頁與投票頁為ISR渲染，解決基本的SEO問題，其餘需要交互的組件或頁面則為CSR。

# 資料庫為Mysql，部署於Azure

資料庫操作的部分，使用prisma，優勢在於請求資料的網域就是客戶端本身。
prisma提供類似mongoDB的方法，方便操作資料。

# Tailwind Css

樣式屬性值的選擇比Bootstrap更多，命名也較為簡潔。
tailwind config 方便客製化自訂樣式。

# 功能部分

Google登入。
投票並顯示投票結果。
後台投票項目的編輯 創建 刪除。

# Redux toolkit

方便全局存取資料於組件上。

# Jest 單元測試

測試了Header組件部分操作顯示及Manage新增投票項目的操作行為。

