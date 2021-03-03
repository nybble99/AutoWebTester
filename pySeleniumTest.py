from pyselenium.test_metadata import Test
from pyselenium.test_steps import *
from pyselenium.test_runner import *

test = Test('My test')
test.add_step(Navigate('http://www.google.com'))
test.add_step(TypeText(css_path='#lst-ib', hint='Google search bar', text='Automating a Google search'))
test.add_step(SendEnter())
test_runner = TestRunner(test)
test_result = test_runner.run_test()

print(test_result)

