# postcards-from-my-jungle
**Project Description** <br>
This project explore the creation of non-existent jungle beasts through generative AI, combining both image generation using pre-trained models, sound synthesis and animal invented language. My strategy was less about "training" models from scratch and more about steering pretrained diffusion models through exessive prompt experimentation. Also a ton of trial-and-error with a massive amount of debugging both on Google Colab and VSCode. I really quickly learned that generative models are super literal, unpredictable, choatic and unforgiving if something is wrong within the code or the prompting. <br>
<br>
**Image Generation** <br>
For the creature images, I used a text-to-image diffusion model in Google Colab. The prompting was different because describing lighting, texture and environement made it so that the AI generates more believable creatures. This was better compared to simply naming animals and asking the AI to come up with something. The approach was to be specific. For example, just saying "new jungle monster", I would include description of the fur, texture, eye glow, fog density and overall setting. From previous trials it was a massive difference when I included environmental descriptions instead of just the creature itself. <br>
<br>
**Sound Generation**
