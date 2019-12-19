<p>A web application to monitor remote machines(servers). 
Thanks to rsyslog, heartbeats and measured parameters(CPU usage, RAM usage and Disk usage) in remote machines are transfered to a central server (On this server, the Python flask app is also runnign). The web application will process the received messages and by using web socket will send a corresponding messages to the web client's user agent(to be visualized as SVG).

For authentication, we used a sqlite3 database with hashed credentials: default is User:admin, Password:admin .
The web application is sitting waiting to receive a change in log files (Web App will be notified by an event from watchdog observor).</p>

![Screen Shot](https://raw.githubusercontent.com/vsaljooghi/Monitor-Remote-Machines-Web-App/master/demo/Dashboard2.png)

![Screen Shot](https://raw.githubusercontent.com/vsaljooghi/Monitor-Remote-Machines-Web-App/master/demo/Dashboard.png)



<p dir='rtl' align='right'>
چهارده سرور به یک سرور مرکزی تجمیع لاگ وصلند و وب اپلیکیشن پایتون روی این سرور اجرا می شود. پیام هایی که از سرورهای راه دور به سرور مرکزی از طریق rsyslog می رسند پردازش شده و در نهایت از طریق پیام های وب سوکت بر روی مرورگر (User Agent) به صورت مصور(SVG) و بلادرنگ (real time) نمایش داده می شوند. 
</p>

<p dir='rtl' align='right'>
در نوشتن وب اپلیکیشن که طرف سرور قراردارد از پایتون و مینی وب فریم ورک فلاسک و طرف کلاینت جاوا اسکریپت، وب سوکت، JQuery و d3 که کتابخانه مصورسازی هستش استفاده شده است. از یک دیتا بیس اسکولایت۳ هم جهت نگهداری اطلاعات کاربران برای احراز هویت استفاده شده است.
</p>

<p dir='rtl' align='right'>
به این ترتیب می شه هر موضوعی رو مانیتور کرد. کافیه  پیام مورد نظر از سرور راه دور برسه به سرور مرکزی و مصورسازی متناظرش تعریف شود.
</p>

