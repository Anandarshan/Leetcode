lis=[2,7,6,4]
lis2=[1,2,6,7,4]
z=0
j=0
for i in range(max(len(lis),len(lis2))):
    try:
        if(z==1):
            ans=lis[i]+lis2[i]+1
            z=0
        else:
            ans=lis[i]+lis2[i]
        if(ans>=10):
            print(str(ans)[1])
            z=1
        else:
            print(ans)
        
    except:
        try:
            if(z==1):
                ans=lis[i]+1
                if((ans)>=10):
                    print(str(ans)[1])
                    z=1
                else:
                    print(ans)
                    z=0
            else:
                print(lis[i])
        except:
            if(z==1):
                ans=lis2[i]+1
                if(ans>=10):
                    print(str(ans)[1])
                    z=1
                else:
                    print(ans)
                    z=0
            else:
                print(lis2[i])
if(ans>=10):
    print("1")
else:
    pass
    
