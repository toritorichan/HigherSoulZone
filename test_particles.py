from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs
    logs = []
    page.on('console', lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
    page.on('pageerror', lambda err: logs.append(f"[ERROR] {err}"))

    page.goto('http://localhost:3737')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    # Check if canvas exists
    canvas_exists = page.evaluate('document.getElementById("particle-canvas") !== null')
    print(f"Canvas exists: {canvas_exists}")

    # Check all canvases on page
    canvas_count = page.evaluate('document.querySelectorAll("canvas").length')
    print(f"Total canvases: {canvas_count}")

    # Check canvas dimensions
    canvas_info = page.evaluate('''() => {
        const c = document.getElementById("particle-canvas")
        if (!c) return "NO CANVAS FOUND"
        return {
            width: c.width,
            height: c.height,
            cssWidth: c.style.width,
            cssHeight: c.style.height,
            zIndex: c.style.zIndex,
            inDOM: document.body.contains(c),
            parentTag: c.parentElement?.tagName,
        }
    }''')
    print(f"Canvas info: {canvas_info}")

    # Simulate mouse move and check particles
    page.mouse.move(400, 300)
    page.wait_for_timeout(100)
    page.mouse.move(500, 350)
    page.wait_for_timeout(100)
    page.mouse.move(600, 400)
    page.wait_for_timeout(500)

    # Take screenshot
    page.screenshot(path='D:/Angel/HigherSoulZone/test_particles.png', full_page=False)
    print("Screenshot saved")

    # Check for any JS errors
    print(f"\nConsole logs ({len(logs)}):")
    for log in logs:
        print(f"  {log}")

    browser.close()
