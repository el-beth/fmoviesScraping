from selenium import webdriver
import sys

# if len(sys.argv) == 1:
# 	exit()
# url=sys.argv[1]

# construct a chromeoptions object using the constructor method in webdriver
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("temp-profile")
options.add_argument("mute-audio")
# options.add_argument("headless")
options.add_argument("verbose")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
# options.add_extension('/home/endu/Downloads/AdBlock — best ad blocker(4.46.0)2022-04-24.crx')
# dc = DesiredCapabilities.CHROME
# dc['goog:loggingPrefs'] = { 'browser':'ALL' }
driver = webdriver.Chrome(options=options, executable_path=r"chromedriver")

driver.get(url)