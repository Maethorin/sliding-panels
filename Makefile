run:
	python -m SimpleHTTPServer 8007

test:
	phantomjs components/phantom-jasmine/run_jasmine_test.coffee spec/SpecRunner.html
