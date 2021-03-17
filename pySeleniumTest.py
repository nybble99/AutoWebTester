from pyselenium.test_metadata import Test
from pyselenium.test_steps import *
from pyselenium.test_runner import *
from pyselenium import driver

test = Test('My test')
test.add_step(Navigate('file:///G:/CSChallengesProject/repo/AutoWebTester/samplePage.html'))
test_runner = TestRunner(test)
test_result = test_runner.run_test()

print(test_result)

