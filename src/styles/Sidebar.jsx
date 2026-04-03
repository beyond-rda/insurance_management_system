.sidebar {
    width: 240px;
    min - height: calc(100vh - 60px);
    background - color: var(--sidebar - bg);
    padding: 20px 0;
    display: flex;
    flex - direction: column;
}

.sidebar__menu {
    list - style: none;
    padding: 0;
    margin: 0;
}

.sidebar__item {
    padding: 14px 24px;
    color: white;
    cursor: pointer;
    font - size: 15px;
    display: flex;
    align - items: center;
    gap: 12px;
    text - decoration: none;

  &:hover {
        background - color: rgba(255, 255, 255, 0.15);
    }
}

.sidebar__divider {
    border: none;
    border - top: 1px solid rgba(255, 255, 255, 0.2);
    margin: 12px 0;
}

.sidebar__toggle {
    margin: 16px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid white;
    color: white;
    border - radius: 8px;
    cursor: pointer;
    font - size: 14px;
    text - align: center;

  &:hover {
        background: white;
        color: #1565c0;
    }
}