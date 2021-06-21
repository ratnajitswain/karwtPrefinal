let editor
let editorData = []



ClassicEditor
	.create(document.querySelector('#editor1'), {

		resizeOptions: [
			{
				name: 'resizeImage:original',
				value: null,
				icon: 'original'
			},
			{
				name: 'resizeImage:50',
				value: '50',
				icon: 'medium'
			},
			{
				name: 'resizeImage:75',
				value: '75',
				icon: 'large'
			}
		],

		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'link',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				'imageUpload',
				'blockQuote',
				'insertTable',
				'undo',
				'redo',

				'htmlEmbed'
			],
			resizeImage:'50',
			resizeImage:'75',
        resizeImage:'original',
		},
		simpleUpload: {
			uploadUrl: '/admin/imageUpload',

			// Enable the XMLHttpRequest.withCredentials property.
			withCredentials: false,
			// headers: {
			//     // 'X-CSRF-TOKEN': 'CSRF-Token',
			//     Authorization: 'Bearer <JSON Web Token>'
			// }
		},

		language: 'en',
		image: {
			toolbar: [
				'imageTextAlternative',
				'imageStyle:full',
				'imageStyle:side'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		licenseKey: '',


	})
	.then(newEditor => {
		editor = newEditor;









	})
	.catch(error => {
		console.error('Oops, something went wrong!');
		console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
		console.warn('Build id: 7xuexbevwbb-d327242bmkbt');
		console.error(error);
	});





			// $('#submit').on('click', function(){  

			// 	console.log(editorData);
			// })
