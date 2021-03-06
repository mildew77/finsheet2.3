<!DOCTYPE html>
<html ng-app="finsheet">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>{{$title}}</title>

<!-- Main Frameworks	 -->
    {{HTML::script('javascript/angular.js')}}
    {{HTML::script('javascript/jquery.js')}}
       
<!-- Scripts used throughout application	 -->

{{HTML::script('javascript/angular.cookie.js')}}
{{HTML::script('javascript/hammer.js')}}
{{HTML::script('javascript/angular.hammer.js')}}
{{HTML::script('javascript/flot.js')}}
{{HTML::script('javascript/flotPie.js')}}
<!-- Styles shared throughout application	 -->

{{HTML::style('css/bootstrap.css');}}
{{HTML::style('css/default.css');}}
{{HTML::style('css/menu.css');}}


	@yield('head')
	</head>
	<body>
	<header>
	<div id="logo">Logo Here</div>
	<div id="login">Login info Here</div>
	</header>
	
	<article>
	<div id="menu">
{{ navi::nav([ 'pages/portfolio' => 'Portfolio Composition', 'pages/assumptions' => 'Assumptions','pages/portfolioreturn' => 'Portfolio Return','pages/valueatrisk' => 'Value at Risk','pages/reversemortgage' => 'Reverse Mortgage']) }}
	@yield('menu')
	</div>
	
	<div id="message"></div>
	<div id="content">
	@yield('content')
	</div>
	</article>
	<footer>
	@yield('footer')
	
	</footer>	
	@yield('scripts')

	</body>
</html>