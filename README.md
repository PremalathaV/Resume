<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pitch Dashboard</title>
<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f6fa;
    display: flex;
}

/* ================= Sidebar ================= */
.sidebar {
    width: 240px;
    background: #ffffff;
    padding: 20px 15px;
    border-right: 1px solid #eee;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
}

.logo-icon {
    background: #7c6cf0;
    color: white;
    font-weight: bold;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}

.logo-text {
    font-weight: bold;
    font-size: 18px;
}

/* Create Button */
.create-btn {
    background: #f3f1fe;
    border: none;
    padding: 12px;
    border-radius: 10px;
    color: #6c63ff;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 25px;
}

/* Menu */
.menu {
    list-style: none;
    padding: 0;
}

.menu li {
    padding: 10px 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    color: #555;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.menu li .icon {
    margin-right: 10px;
}

.menu li:hover {
    background: #f5f5ff;
}

/* Active Menu */
.menu li.active {
    background: #ecebff;
    color: #6c63ff;
    font-weight: bold;
}

/* Upgrade Box */
.upgrade-card {
    background: #f7f7fb;
    padding: 15px;
    border-radius: 12px;
    text-align: center;
}

.upgrade-card button {
    margin-top: 10px;
    background: #7c6cf0;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
}

/* ================= Main ================= */
.main {
    flex: 1;
    padding: 20px;
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.profile {
    display: flex;
    align-items: center;
}

.profile-circle {
    background: #7c6cf0;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Banner */
.banner {
    background: #d8cff7;
    margin-top: 20px;
    padding: 25px;
    border-radius: 15px;
}

/* Cards */
.cards {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.card {
    flex: 1;
    padding: 15px;
    border-radius: 10px;
    color: white;
    text-align: center;
}

.yellow { background: #f7c948; }
.purple { background: #7c6cf0; }
.pink { background: #ff5d8f; }
.light { background: #aaa6d8; }

/* Projects */
.project {
    background: white;
    margin-top: 15px;
    padding: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.project-info {
    display: flex;
    align-items: center;
}

.project img {
    width: 60px;
    border-radius: 10px;
    margin-right: 15px;
}

/* Toggle Switch */
.switch {
    width: 40px;
    height: 20px;
    border-radius: 20px;
    background: #ccc;
    position: relative;
}

.switch::after {
    content: "";
    width: 18px;
    height: 18px;
    background: white;
    position: absolute;
    top: 1px;
    left: 1px;
    border-radius: 50%;
}
</style>
</head>

<body>

<!-- Sidebar -->
<div class="sidebar">

    <div>
        <div class="logo">
            <div class="logo-icon">P</div>
            <div class="logo-text">Pitch.io</div>
        </div>

        <button class="create-btn">+ Create New Pitch</button>

        <ul class="menu">
            <li class="active"><span class="icon">🏠</span>Dashboard</li>
            <li><span class="icon">✏️</span>Editor</li>
            <li><span class="icon">👥</span>Leads</li>
            <li><span class="icon">⚙️</span>Settings</li>
            <li><span class="icon">👁️</span>Preview</li>
        </ul>
    </div>

    <div class="upgrade-card">
        <p>Upgrade to Pro for more features</p>
        <button>Upgrade</button>
    </div>

</div>

<!-- Main -->
<div class="main">

    <div class="header">
        <div>
            <h3>Dashboard</h3>
            <small>Monday, 02 March 2020</small>
        </div>

        <div class="profile">
            <div class="profile-circle">AJ</div>
            <span style="margin-left:10px;">Alyssa Jones</span>
        </div>
    </div>

    <div class="banner">
        <h1>Hi, Alyssa</h1>
        <p>Ready to start your day with some pitch decks?</p>
    </div>

    <div class="cards">
        <div class="card yellow">
            <h2>83%</h2>
            <p>Open Rate</p>
        </div>

        <div class="card purple">
            <h2>77%</h2>
            <p>Complete</p>
        </div>

        <div class="card pink">
            <h2>91</h2>
            <p>Unique Views</p>
        </div>

        <div class="card light">
            <h2>126</h2>
            <p>Total Views</p>
        </div>
    </div>

    <div class="project">
        <div class="project-info">
            <img src="https://via.placeholder.com/60">
            <div>
                <strong>Next in Fashion</strong>
                <p>10 Slides</p>
            </div>
        </div>
        <div class="switch"></div>
    </div>

    <div class="project">
        <div class="project-info">
            <img src="https://via.placeholder.com/60">
            <div>
                <strong>Digital Marketing Today</strong>
                <p>10 Slides</p>
            </div>
        </div>
        <div class="switch"></div>
    </div>

</div>

</body>
</html>
