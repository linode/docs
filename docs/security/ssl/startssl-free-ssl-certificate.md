# StartSSL free ssl certificate
In this guide I will teach you how to get a free valid SSL certificate from StartSSL.

DISCLAIMER: This guide only works for a second level domains(That means that sub domains do not work).

1. Go to https://www.startssl.com/?app=12 and click Express Lane.
2.  Then fill in all the fields with your information. (Keep in mind that you will have to verify your email address)
3.  When you click continue you should get an email to the address you specified in the last step. In that email there should be an authentication code, take that code and place it in the field in on the startssl.com site which you should still have open and then click Continue.
4. Now you should be at a page named "Generate a private key", just click continue if you want to follow the tutorial.
5. On the next page just click install.
6. The next page should be named "Congratulations!" if so click continue.
7. Now it is time to specify your domain and once again you can not do this with a sub domain. When you have specified the domain click continue.
8. Now comes the tricky part for some people we need a verification email so select the one that works best for you if you do not have any of the mail addresses you will need to setup a mail server. Then click continue.
9. Now you should have gotten another email but this time to the address you used to verify the domain. Do the same thing as last time, just enter the code from the email in the field.
10. Now at step 10 you will finally be able to start making the ssl certificate(Yes it is a lot of steps but keep in mind it is free). Now you should be at a page named "Generate private key".(You can skip this page if you have generated a key and csr with OpenSSL or similar software). So now to enter a password for the ssl key, you will have to remeber this password for later. and then select SHA2 unless that is not already selected and then click continue.
11. Now you should get the key just save the contents to a .key file and click continue.
12. On this page just click continue.
13. Now you can add a ONE sub domain aswell for example this could be www or mail(I recommend www). Click continue and click continue again.
14. On this page the certificate text will be just copy it and put it in a .crt file.
15. And there you go now you should have a free ssl certificate! Hope you succeded with this tutorial. Good Luck!
