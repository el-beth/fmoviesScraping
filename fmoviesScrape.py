from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys as K
from sys import argv
from time import sleep
import re

if len(argv) == 1:
	exit()
# url=argv[1]
url="https://fmovies.to/movie/the-danish-girl-28p0/1-full"

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
driver = webdriver.Chrome(options=options, executable_path=r"chromedriver_cdc_removed")

def teardown():
	driver.close()
	driver.quit()

driver.get(url)