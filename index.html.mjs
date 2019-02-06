const GA_ID = null; // TODO Google Analytics
const SERVER_URI = `${process.env.SERVER_URI}` || 'ws://127.0.0.1';

export default `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/css/foundation.min.css">
    <title>HereIAm | Headless device network config tracker</title>
</head>
<body>
<noscript>
    You need to enable JavaScript to run this app.
</noscript>
<div id="root"></div>
<script type="text/javascript">
    window.SERVER_URI = '${SERVER_URI}';
</script>
<script src="bundle.js" type="text/javascript"></script>
</body>
</html>
`;